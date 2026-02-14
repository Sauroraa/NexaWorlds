package fr.nexaworlds.nexalink.services;

import fr.nexaworlds.nexalink.NexaLink;
import org.bukkit.Bukkit;

public class CommandExecutor {

    private final NexaLink plugin;

    public CommandExecutor(NexaLink plugin) {
        this.plugin = plugin;
    }

    public void executeCommand(String command) {
        Bukkit.getScheduler().runTask(plugin, () -> {
            plugin.getLogger().info("Executing command from API: " + command);
            Bukkit.dispatchCommand(Bukkit.getConsoleSender(), command);
        });
    }

    public void giveGrade(String playerName, String grade) {
        executeCommand("lp user " + playerName + " parent set " + grade.toLowerCase());
        plugin.getLogger().info("Grade " + grade + " given to " + playerName);
    }

    public void giveShards(String playerName, int amount) {
        executeCommand("eco give " + playerName + " " + amount);
        plugin.getLogger().info(amount + " shards given to " + playerName);
    }

    public void giveKey(String playerName, String crateType, int amount) {
        executeCommand("crates givekey " + playerName + " " + crateType + " " + amount);
        plugin.getLogger().info(amount + " " + crateType + " keys given to " + playerName);
    }

    public void giveVoteReward(String playerName) {
        executeCommand("eco give " + playerName + " 50");
        executeCommand("crates givekey " + playerName + " common 1");
        plugin.getLogger().info("Vote reward given to " + playerName);
    }
}
